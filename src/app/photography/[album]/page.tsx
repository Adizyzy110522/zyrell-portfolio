import { albums } from "../../../data/albums";
import AlbumClient from "./AlbumClient";

export function generateStaticParams() {
  return Object.keys(albums).map((album) => ({ album }));
}

export const dynamicParams = false;

export default function Page() {
  return <AlbumClient />;
}
