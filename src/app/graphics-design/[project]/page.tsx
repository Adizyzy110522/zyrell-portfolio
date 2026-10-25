import { projects } from "../../../data/projects";
import ProjectClient from "./ProjectClient";

export function generateStaticParams() {
  return Object.keys(projects).map((project) => ({ project }));
}

export const dynamicParams = false;

export default function Page() {
  return <ProjectClient />;
}
