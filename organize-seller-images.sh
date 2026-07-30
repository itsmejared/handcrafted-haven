#!/bin/bash
# Run this from the root of the handcrafted-haven project.
# Requires: brew install webp   (for cwebp)
set -e

BASE="public/seller-images"

echo "Creating seller folders..."
mkdir -p "$BASE/catherine-lewis-clay-co"
mkdir -p "$BASE/mckenna-craig-knotted-dreams"
mkdir -p "$BASE/heather-bradford-scarves"
mkdir -p "$BASE/josh-sears-guitars"
mkdir -p "$BASE/sean-johnson-painter"
mkdir -p "$BASE/jennifer-lyons-soap"
mkdir -p "$BASE/katrina-burrup-jewelry"
mkdir -p "$BASE/jilly-michaels-clothing"
mkdir -p "$BASE/nick-fuentas-homegoods"

echo "Converting new jpg images (products-new) to webp..."
cd public/products-new
for f in *.jpg; do
  cwebp -q 80 "$f" -o "${f%.jpg}.webp"
done
cd ../..

echo "Converting Jennifer Lyons profile photo to webp..."
cwebp -q 80 "public/Jennifer Lyons - soap artist.jpg" -o "public/Jennifer Lyons - soap artist.webp"

echo "Copying existing seller product photos into their folders..."
cp "public/Ceramic Bowls.webp" "$BASE/catherine-lewis-clay-co/"
cp "public/Macrame Wall Art.webp" "$BASE/mckenna-craig-knotted-dreams/"
cp "public/Hand died Scarf.webp" "$BASE/heather-bradford-scarves/"
cp "public/Custom Guitar.webp" "$BASE/josh-sears-guitars/"
cp "public/Watercolor art.webp" "$BASE/sean-johnson-painter/"
cp "public/Lavendar soap set.webp" "$BASE/jennifer-lyons-soap/"

echo "Copying new product photos into their seller folders..."
cp public/products-new/pottery-vase.webp "$BASE/catherine-lewis-clay-co/"
cp public/products-new/macrame-bracelet.webp public/products-new/macrame-plant-hanger.webp "$BASE/mckenna-craig-knotted-dreams/"
cp public/products-new/scarf-collection.webp "$BASE/heather-bradford-scarves/"
cp public/products-new/soap-collection.webp "$BASE/jennifer-lyons-soap/"
cp public/products-new/beaded-necklace.webp "$BASE/katrina-burrup-jewelry/"
cp public/products-new/cotton-shirt.webp public/products-new/denim-shorts.webp public/products-new/flowy-skirt.webp public/products-new/knit-sweater.webp public/products-new/linen-pants.webp public/products-new/sundress.webp "$BASE/jilly-michaels-clothing/"
cp public/products-new/artisan-candle.webp public/products-new/cutting-board.webp public/products-new/leather-wallet.webp public/products-new/woven-basket.webp public/products-new/wool-blanket.webp "$BASE/nick-fuentas-homegoods/"

echo "Done! Review $BASE before deleting the old .jpg files or products-new folder."
echo "Old jpgs are untouched - delete manually once you confirm the webp versions look right:"
echo "  rm public/products-new/*.jpg"
echo "  rm 'public/Jennifer Lyons - soap artist.jpg'"
