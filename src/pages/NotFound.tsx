import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 py-20 text-center md:px-8 md:py-28">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-2xl text-accent-700">
        <i className="ri-compass-3-line" aria-hidden="true" />
      </span>
      <p className="k-label mt-5">Page not found</p>
      <h1 className="font-display mt-2 max-w-lg text-[30px] text-foreground-950 md:text-[40px]">This route is not part of the network yet.</h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-foreground-600">
        The page may have moved. Head back to discovery, or start from the home page to find businesses, work and financial tools.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link to="/"><Button icon="ri-home-5-line">Back to home</Button></Link>
        <Link to="/discover"><Button variant="outline" icon="ri-map-pin-2-line">Find businesses near me</Button></Link>
      </div>
    </section>
  );
}