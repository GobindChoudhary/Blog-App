import { Link } from "react-router-dom";
import PageNotFoundImage from "../img/404.png";
import fullLogo from "../img/full-logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
        src={PageNotFoundImage}
        alt=""
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        THe page you are looking for does not exist. Head back to the{" "}
        <Link to="/" className="text-black underline">
          home page
        </Link>
      </p>

      <div className="mt-auto">
        <img
          className="h-8 object-contain block mx-auto select-none"
          src={fullLogo}
          alt=""
        />
        <p className="mt-5 text-dark-grey">
          Read millions of stories around the world
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
