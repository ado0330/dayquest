import type { ComponentType } from "react";
import * as bath from "./objects/bathroom";
import * as clothing from "./objects/clothing";
import * as home from "./objects/home";
import * as nature from "./objects/nature";
import * as school from "./objects/school";
import * as toys from "./objects/toys";

/**
 * Every drawable object, keyed by the id that mission data refers to.
 * Adding artwork: draw a component in a 120×120 box and register it here.
 */
export const artObjects = {
  // bathroom
  toothbrush: bath.Toothbrush,
  tooth: bath.Tooth,
  smile: bath.Smile,
  "toothbrush-cup": bath.ToothbrushCup,
  "paste-pea": bath.PastePea,
  "paste-big": bath.PasteBig,
  hairbrush: bath.Hairbrush,
  paintbrush: bath.Paintbrush,
  sink: bath.Sink,
  "soap-pump": bath.SoapPump,
  towel: bath.Towel,
  toilet: bath.Toilet,
  "tissue-box": bath.TissueBox,
  hands: bath.Hands,
  "hands-bubbles": bath.HandsBubbles,
  "sand-timer": bath.SandTimer,
  bathtub: bath.Bathtub,
  "water-drop": bath.WaterDrop,
  // clothing
  raincoat: clothing.Raincoat,
  swimsuit: clothing.Swimsuit,
  "sun-hat": clothing.SunHat,
  "t-shirt": clothing.TShirt,
  trousers: clothing.Trousers,
  socks: clothing.Socks,
  shoes: clothing.Shoes,
  sneakers: clothing.Sneakers,
  pyjamas: clothing.Pyjamas,
  // home
  bed: home.Bed,
  "alarm-clock": home.AlarmClock,
  door: home.Door,
  lamp: home.Lamp,
  rug: home.Rug,
  "breakfast-bowl": home.BreakfastBowl,
  apple: home.Apple,
  // school
  backpack: school.Backpack,
  books: school.Books,
  "pencil-case": school.PencilCase,
  "water-bottle": school.WaterBottle,
  lunchbox: school.Lunchbox,
  folder: school.Folder,
  timetable: school.Timetable,
  // toys
  teddy: toys.Teddy,
  "toy-car": toys.ToyCar,
  blocks: toys.Blocks,
  ball: toys.Ball,
  "toy-box": toys.ToyBox,
  bookshelf: toys.Bookshelf,
  "block-bin": toys.BlockBin,
  "crayon-cup": toys.CrayonCup,
  book: toys.Book,
  "book-moon": toys.BookMoon,
  "book-star": toys.BookStar,
  "book-boat": toys.BookBoat,
  // nature & feelings
  sun: nature.Sun,
  moon: nature.Moon,
  star: nature.Star,
  "rain-cloud": nature.RainCloud,
  bubbles: nature.Bubbles,
} satisfies Record<string, ComponentType>;

export type ArtObjectId = keyof typeof artObjects;

export const artObjectIds = Object.keys(artObjects) as ArtObjectId[];

export const backdropIds = [
  "bedroom",
  "bathroom",
  "kitchen",
  "school",
  "playroom",
  "night",
  "outdoors",
  "rainy",
] as const;

export type BackdropId = (typeof backdropIds)[number];

export function isArtObjectId(value: string): value is ArtObjectId {
  return Object.prototype.hasOwnProperty.call(artObjects, value);
}
