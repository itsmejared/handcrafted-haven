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
