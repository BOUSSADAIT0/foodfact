package app

import cats.effect.IO
import org.http4s._
import org.http4s.client._
import org.http4s.implicits._
import org.http4s.circe.CirceEntityCodec._
import io.circe.syntax._

class OpenFoodClient(client: Client[IO]) {

  /** Recherche OpenFoodFacts brute (avec images) */
  def rawSearch(query: String): IO[SearchResponse] = {
    val uri = uri"https://world.openfoodfacts.org/cgi/search.pl"
      .withQueryParams(
        Map(
          "search_terms" -> query,
          "search_simple" -> "1",
          "action" -> "process",
          "json" -> "1",
          "page_size" -> "50",
          "fields" -> "code,product_name,brands,categories,quantity,nutriscore_grade,ecoscore_grade,nova_group,ingredients_text,allergens,labels,countries,image_small_url,image_url,nutriments"
        )
      )

    client.expect[SearchResponse](Request[IO](method = Method.GET, uri = uri))
  }


  /** Détails produit par code-barres */
  def getProduct(barcode: String): IO[Product] = {
    val uri = uri"https://world.openfoodfacts.org/api/v0/product" / s"$barcode.json"

    client.expect[ProductResponse](Request[IO](Method.GET, uri)).map { resp =>
      resp.product.getOrElse(
        Product(
          code = barcode,
          product_name = None,
          brands = None,
          categories = None,
          quantity = None,
          nutriscore_grade = None,
          ecoscore_grade = None,
          nova_group = None,
          ingredients_text = None,
          allergens = None,
          additives_tags = None,
          labels = None,
          countries = None,
          image_url = None,
          image_small_url = None,
          image_front_url = None,
          nutriments = None
        )
      )
    }
  }

  /** Trouver des alternatives basées sur la catégorie */
  def getAlternatives(product: Product): IO[List[Product]] = {
    val mainCategory = product.categories
      .flatMap(_.split(",").headOption)
      .getOrElse("")

    if mainCategory.isBlank then IO.pure(Nil)
    else
      rawSearch(mainCategory).map { resp =>
        resp.products.filter(p => p.code != product.code).take(10)
      }
  }
}
