import { GearIcon } from "@radix-ui/react-icons";

const Loading = () => {
  return (
    <section className="container mx-auto mt-12 px-2">
      <GearIcon className="mx-auto mt-12 size-24 animate-spin" />
    </section>
  );
};

export default Loading;