package app

import cats.effect._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.server.Router
import org.http4s.implicits._
import org.http4s.ember.server._
import org.http4s.ember.client._
import org.http4s.circe._
import io.circe.syntax._
import com.comcast.ip4s._
import org.http4s.server.middleware.{CORS, CORSConfig}

// Query parameter extractors
object QParam         extends OptionalQueryParamDecoderMatcher[String]("q")
object BrandParam     extends OptionalQueryParamDecoderMatcher[String]("brand")
object CountryParam   extends OptionalQueryParamDecoderMatcher[String]("country")
object SortByParam    extends OptionalQueryParamDecoderMatcher[String]("sortBy")
object OrderParam     extends OptionalQueryParamDecoderMatcher[String]("order")
object MinEnergyParam extends OptionalQueryParamDecoderMatcher[Double]("minEnergy")
object MaxEnergyParam extends OptionalQueryParamDecoderMatcher[Double]("maxEnergy")
object MinSugarParam  extends OptionalQueryParamDecoderMatcher[Double]("minSugar")
object MaxSugarParam  extends OptionalQueryParamDecoderMatcher[Double]("maxSugar")
object MinFatParam    extends OptionalQueryParamDecoderMatcher[Double]("minFat")
object MaxFatParam    extends OptionalQueryParamDecoderMatcher[Double]("maxFat")

object Server extends IOApp {

  // Country normalization map for efficient lookups
  private val countryVariants: Map[String, Set[String]] = Map(
    "france" -> Set("france", "fr", "en:france", "fr:france", "en:fr", "fr:fr"),
    "belgique" -> Set("belgique", "belgium", "be", "en:belgium", "fr:belgique", "en:be", "fr:be"),
    "belgium" -> Set("belgique", "belgium", "be", "en:belgium", "fr:belgique", "en:be", "fr:be"),
    "suisse" -> Set("suisse", "switzerland", "ch", "en:switzerland", "fr:suisse", "en:ch", "fr:ch"),
    "switzerland" -> Set("suisse", "switzerland", "ch", "en:switzerland", "fr:suisse", "en:ch", "fr:ch"),
    "canada" -> Set("canada", "ca", "en:canada", "fr:canada", "en:ca", "fr:ca"),
    "espagne" -> Set("espagne", "spain", "es", "en:spain", "fr:espagne", "en:es", "fr:es"),
    "spain" -> Set("espagne", "spain", "es", "en:spain", "fr:espagne", "en:es", "fr:es"),
    "italie" -> Set("italie", "italy", "it", "en:italy", "fr:italie", "en:it", "fr:it"),
    "italy" -> Set("italie", "italy", "it", "en:italy", "fr:italie", "en:it", "fr:it"),
    "allemagne" -> Set("allemagne", "germany", "de", "en:germany", "fr:allemagne", "en:de", "fr:de"),
    "germany" -> Set("allemagne", "germany", "de", "en:germany", "fr:allemagne", "en:de", "fr:de"),
    "maroc" -> Set("maroc", "morocco", "ma", "en:morocco", "fr:maroc", "en:ma", "fr:ma"),
    "morocco" -> Set("maroc", "morocco", "ma", "en:morocco", "fr:maroc", "en:ma", "fr:ma")
  )

  private def normalizeCountry(country: String): Set[String] = {
    val lower = country.toLowerCase.trim
    countryVariants.getOrElse(lower, Set(lower, s"en:$lower", s"fr:$lower"))
  }

  private def countryMatches(countriesStr: String, searchCountry: String): Boolean = {
    if (countriesStr.trim.isEmpty) return false
    
    val searchVariants = normalizeCountry(searchCountry.toLowerCase.trim)
    val countryParts = countriesStr.toLowerCase
      .split(Array(',', ';', '|', '\n', ' '))
      .map(_.trim.replaceAll("^(en|fr):", ""))
      .filter(_.nonEmpty)
    
    countryParts.exists(part => searchVariants.exists(variant => 
      part == variant.replaceAll("^(en|fr):", "")
    ))
  }

  override def run(args: List[String]): IO[ExitCode] = {
    EmberClientBuilder.default[IO].build.use { client =>
      val api = new OpenFoodClient(client)

      val routes = HttpRoutes.of[IO] {
        // SEARCH ENDPOINT
        case GET -> Root / "api" / "search"
            :? QParam(maybeQ)
            +& BrandParam(maybeBrand)
            +& CountryParam(maybeCountry)
            +& SortByParam(maybeSortBy)
            +& OrderParam(maybeOrder)
            +& MinEnergyParam(minEnergy)
            +& MaxEnergyParam(maxEnergy)
            +& MinSugarParam(minSugar)
            +& MaxSugarParam(maxSugar)
            +& MinFatParam(minFat)
            +& MaxFatParam(maxFat) =>

          maybeQ match {
            case None => BadRequest("Missing q parameter")
            case Some(query) =>
              api.rawSearch(query).flatMap { resp =>
                // Apply filters
                val filtered = resp.products
                  .filter(p => maybeCountry.forall(c => p.countries.exists(cs => countryMatches(cs, c))))
                  .filter(p => maybeBrand.forall(b => p.brands.exists(_.toLowerCase.contains(b.toLowerCase))))
                  .filter(p => minEnergy.forall(min => p.nutriments.flatMap(_.energy).exists(_ >= min)))
                  .filter(p => maxEnergy.forall(max => p.nutriments.flatMap(_.energy).exists(_ <= max)))
                  .filter(p => minSugar.forall(min => p.nutriments.flatMap(_.sugars).exists(_ >= min)))
                  .filter(p => maxSugar.forall(max => p.nutriments.flatMap(_.sugars).exists(_ <= max)))
                  .filter(p => minFat.forall(min => p.nutriments.flatMap(_.fat).exists(_ >= min)))
                  .filter(p => maxFat.forall(max => p.nutriments.flatMap(_.fat).exists(_ <= max)))

                // Apply sorting
                val sorted = (maybeSortBy, maybeOrder) match {
                  case (Some("energy"), Some("desc")) => filtered.sortBy(_.nutriments.flatMap(_.energy)).reverse
                  case (Some("energy"), _)            => filtered.sortBy(_.nutriments.flatMap(_.energy))
                  case (Some("sugars"), Some("desc")) => filtered.sortBy(_.nutriments.flatMap(_.sugars)).reverse
                  case (Some("sugars"), _)            => filtered.sortBy(_.nutriments.flatMap(_.sugars))
                  case (Some("fat"), Some("desc"))    => filtered.sortBy(_.nutriments.flatMap(_.fat)).reverse
                  case (Some("fat"), _)               => filtered.sortBy(_.nutriments.flatMap(_.fat))
                  case _                              => filtered
                }

                Ok(SearchResponse(count = sorted.length, products = sorted).asJson)
              }
          }

        // PRODUCT DETAIL ENDPOINT
        case GET -> Root / "api" / "product" / barcode =>
          for {
            product <- api.getProduct(barcode)
            alternatives <- api.rawSearch(product.product_name.getOrElse(""))
              .map(_.products.filter(_.code != barcode).take(8))
            res <- Ok(Map("product" -> product.asJson, "alternatives" -> alternatives.asJson).asJson)
          } yield res
      }

      val httpApp = Router("/" -> routes).orNotFound
      val corsConfig = CORSConfig.default.withAnyOrigin(true).withAnyMethod(true).withAllowCredentials(true)
      val httpAppWithCors = CORS(httpApp, corsConfig)

      EmberServerBuilder
        .default[IO]
        .withPort(port"8080")
        .withHost(ipv4"0.0.0.0")
        .withHttpApp(httpAppWithCors)
        .build
        .useForever
        .as(ExitCode.Success)
    }
  }
}
