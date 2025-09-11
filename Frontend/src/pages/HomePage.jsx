import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";

const HomePage = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <div className="">Latest blogs</div>
            <div className="">Trending blogs</div>
          </InPageNavigation>
        </div>
        {/* filter and trending */}
        <div className=""></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
