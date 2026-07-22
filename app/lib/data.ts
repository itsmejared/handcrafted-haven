export const categories = [
  { name: "Jewelry", image: "/jewelry.webp", alt: "Colorful gemstone pendant necklaces displayed against a woven backdrop", desc: "Handcrafted rings, necklaces, and bracelets" },
  { name: "Home Decor", image: "/home decor.webp", alt: "Cozy living room with a blue accent wall, sofa, and warm lighting", desc: "Unique pieces to beautify your space" },
  { name: "Clothing", image: "/clothing.webp", alt: "Rack of blue clothing items hanging in a boutique", desc: "One-of-a-kind wearable art" },
  { name: "Music & Instruments", image: "/musical instrument.webp", alt: "Close-up of a vintage sunburst electric guitar", desc: "Custom handcrafted guitars, ukuleles, and more" },
  { name: "Bath & Beauty", image: "/Bath and Beauty.webp", alt: "Bundles of lavender beside handmade soap bars", desc: "Handmade soaps, lotions, and natural skincare" },
  { name: "Art & Collectibles", image: "/Art and Collectables.webp", alt: "Shelves filled with vintage collectibles and framed art", desc: "Original artwork and unique collectible pieces" },
];

export const products = [
  { name: "Ceramic Bowl Set", price: "$45", seller: "Clay & Co", image: "/Ceramic Bowls.webp", alt: "Colorful hand-painted ceramic bowls stacked together", category: "Home Decor" },
  { name: "Macrame Wall Art", price: "$78", seller: "Knotted Dreams", image: "/Macrame Wall Art.webp", alt: "Macrame wall hanging with feather-shaped woven pieces on a wooden dowel", category: "Home Decor" },
  { name: "Hand-dyed Scarf", price: "$52", seller: "Color Flow Studio", image: "/Hand died Scarf.webp", alt: "Woman wearing a flowing red hand-dyed scarf outdoors", category: "Clothing" },
  { name: "Custom Guitar", price: "$299", seller: "Strings & Things", image: "/Custom Guitar.webp", alt: "Musician playing an acoustic guitar outdoors", category: "Music & Instruments" },
  { name: "Lavender Soap Set", price: "$24", seller: "Pure Botanicals", image: "/Lavendar soap set.webp", alt: "Gift-wrapped handmade soap bars tied with ribbon and lavender sprigs", category: "Bath & Beauty" },
  { name: "Watercolor Print", price: "$65", seller: "Artisan Brush Co", image: "/Watercolor art.webp", alt: "Abstract blue and teal watercolor painting", category: "Art & Collectibles" },
];

export interface Seller {
  id: string;
  name: string;
  craft: string;
  bio: string;
  image: string;
  imageAlt: string;
}

export const sellers: Seller[] = [
  {
    id: "josh-sears",
    name: "Josh Sears",
    craft: "Custom Guitar Builder",
    bio: "Josh hand-builds custom electric and acoustic guitars, blending traditional woodworking techniques with a passion for tone and playability. Every instrument is one of a kind, built to match the player's style.",
    image: "/Josh Sears - Guitar artist.webp",
    imageAlt: "Josh Sears, custom guitar builder",
  },
  {
    id: "jennifer-lyons",
    name: "Jennifer Lyons",
    craft: "Handmade Bath & Body",
    bio: "Jennifer creates custom lavender soap gift sets, bath bombs, and shower bombs using natural ingredients and small-batch methods. Her products are designed to turn everyday self-care into a little luxury.",
    image: "/Jennifer Lyons - soap artist.jpg",
    imageAlt: "Jennifer Lyons, handmade bath and body artisan",
  },
  {
    id: "catherine-lewis",
    name: "Catherine Lewis",
    craft: "Ceramic Artist",
    bio: "Catherine throws and glazes custom pottery bowls on her wheel, drawing inspiration from natural textures and colors. Each piece is functional art meant to be used and loved every day.",
    image: "/Catherine Lewis - Pottery artist.webp",
    imageAlt: "Catherine Lewis, ceramic artist",
  },
  {
    id: "sean-johnson",
    name: "Sean Johnson",
    craft: "Watercolor Artist",
    bio: "Sean paints original watercolor pieces inspired by landscapes and quiet moments. His work captures light and movement with a loose, expressive style.",
    image: "/Sean Johnson - painter.webp",
    imageAlt: "Sean Johnson, watercolor artist",
  },
  {
    id: "mckenna-craig",
    name: "McKenna Craig",
    craft: "Macrame Artist",
    bio: "McKenna designs and knots custom macrame wall art, combining classic technique with modern, minimalist shapes. Each piece is made to order and sized to fit any space.",
    image: "/McKenna Craig - Macrame artist.webp",
    imageAlt: "McKenna Craig, macrame artist",
  },
  {
    id: "heather-bradford",
    name: "Heather Bradford",
    craft: "Textile Artist",
    bio: "Heather hand-dyes scarves using small-batch techniques that produce rich, one-of-a-kind color patterns. Every scarf is a wearable piece of art.",
    image: "/Heather Bradford - scarf artist.webp",
    imageAlt: "Heather Bradford, textile artist",
  },
];
