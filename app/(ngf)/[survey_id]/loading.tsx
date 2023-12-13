import { GearIcon } from "@radix-ui/react-icons";

const Loading = () => {
  return (
    <section className="px-2 mt-12 container mx-auto">
      <GearIcon className="w-24 h-24 animate-spin mt-12 mx-auto" />
    </section>
  );
};

export default Loading;