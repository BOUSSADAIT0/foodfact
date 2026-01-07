error id: file:///C:/Users/admin/Documents/dev/ipssi/ia/scala/Scala-Food/scala-3-project-template/src/main/scala/Server.scala:`<none>`.
file:///C:/Users/admin/Documents/dev/ipssi/ia/scala/Scala-Food/scala-3-project-template/src/main/scala/Server.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -cats/effect.
	 -cats/effect#
	 -cats/effect().
	 -org/http4s.
	 -org/http4s#
	 -org/http4s().
	 -org/http4s/dsl/io.
	 -org/http4s/dsl/io#
	 -org/http4s/dsl/io().
	 -org/http4s/implicits.
	 -org/http4s/implicits#
	 -org/http4s/implicits().
	 -org/http4s/ember/server.
	 -org/http4s/ember/server#
	 -org/http4s/ember/server().
	 -org/http4s/ember/client.
	 -org/http4s/ember/client#
	 -org/http4s/ember/client().
	 -org/http4s/circe.
	 -org/http4s/circe#
	 -org/http4s/circe().
	 -io/circe/syntax.
	 -io/circe/syntax#
	 -io/circe/syntax().
	 -com/comcast/ip4s.
	 -com/comcast/ip4s#
	 -com/comcast/ip4s().
	 -scala/Predef.
	 -scala/Predef#
	 -scala/Predef().
offset: 2613
uri: file:///C:/Users/admin/Documents/dev/ipssi/ia/scala/Scala-Food/scala-3-project-template/src/main/scala/Server.scala
text:
```scala
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

object QParam         extends OptionalQueryParamDecoderMatcher[String]("q")
object BrandParam     extends OptionalQueryParamDecoderMatcher[String]("brand")
object SortByParam    extends OptionalQueryParamDecoderMatcher[String]("sortBy")
object OrderParam     extends OptionalQueryParamDecoderMatcher[String]("order")

object MinEnergyParam extends OptionalQueryParamDecoderMatcher[Double]("minEnergy")
object MaxEnergyParam extends OptionalQueryParamDecoderMatcher[Double]("maxEnergy")
object MinSugarParam  extends OptionalQueryParamDecoderMatcher[Double]("minSugar")
object MaxSugarParam  extends OptionalQueryParamDecoderMatcher[Double]("maxSugar")
object MinFatParam    extends OptionalQueryParamDecoderMatcher[Double]("minFat")
object MaxFatParam    extends OptionalQueryParamDecoderMatcher[Double]("maxFat")

object Server extends IOApp {

  override def run(args: List[String]): IO[ExitCode] = {

    EmberClientBuilder.default[IO].build.use { client =>

      val api = new OpenFoodClient(client)

      val routes = HttpRoutes.of[IO] {

        // -------------------------------
        // Recherche avancée
        // -------------------------------
        case GET -> Root / "api" / "search"
            :? QParam(maybeQ)
            +& BrandParam(maybeBrand)
            +& SortByParam(maybeSortBy)
            +& OrderParam(maybeOrder)
            +& MinEnergyParam(minEnergy)
            +& MaxEnergyParam(maxEnergy)
            +& MinSugarParam(minSugar)
            +& MaxSugarParam(maxSugar)
            +& MinFatParam(minFat)
            +& MaxFatParam(maxFat) =>

          maybeQ match
            case None => BadRequest("Missing q parameter")
            case Some(query) =>
              api.rawSearch(query).flatMap { resp =>

                // FILTRES
                val filtered = resp.products
                  .filter(p => maybeBrand.forall(b => p.brands.exists(_.contains(b))))
                  .filter(p => minEnergy.forall(min => p.nutriments.flatMap(_.energy).exists(_ >= min)))
                  .filter(p => maxEnergy.forall(max => p.nutriments.flatMap(_.energy).exists(_ <= max)))
                  .filter(p => minSugar.forall(min => p.nutriments.flatMap(_.sugars).exi@@sts(_ >= min)))
                  .filter(p => maxSugar.forall(max => p.nutriments.flatMap(_.sugars).exists(_ <= max)))
                  .filter(p => minFat.forall(min => p.nutriments.flatMap(_.fat).exists(_ >= min)))
                  .filter(p => maxFat.forall(max => p.nutriments.flatMap(_.fat).exists(_ <= max)))

                // TRI
                val sorted = (maybeSortBy, maybeOrder) match
                  case (Some("energy"), Some("desc")) => filtered.sortBy(_.nutriments.flatMap(_.energy)).reverse
                  case (Some("energy"), _)           => filtered.sortBy(_.nutriments.flatMap(_.energy))

                  case (Some("sugars"), Some("desc")) => filtered.sortBy(_.nutriments.flatMap(_.sugars)).reverse
                  case (Some("sugars"), _)            => filtered.sortBy(_.nutriments.flatMap(_.sugars))

                  case (Some("fat"), Some("desc"))    => filtered.sortBy(_.nutriments.flatMap(_.fat)).reverse
                  case (Some("fat"), _)               => filtered.sortBy(_.nutriments.flatMap(_.fat))

                  case _ => filtered

                Ok(
                  SearchResponse(
                    count = sorted.length,
                    products = sorted
                  ).asJson
                )
              }

        // -------------------------------
        // Détail produit
        // -------------------------------
        case GET -> Root / "api" / "product" / barcode =>
          api.getProduct(barcode).flatMap(p => Ok(p.asJson))
      }

      val httpApp = Router("/" -> routes).orNotFound

      val corsConfig = CORSConfig.default
        .withAnyOrigin(true)
        .withAnyMethod(true)
        .withAllowCredentials(true)

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

```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.