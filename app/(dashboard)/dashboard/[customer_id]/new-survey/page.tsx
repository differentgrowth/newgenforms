import { NewSurveyForm } from "@/components/forms-survey";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {
    customer_id: string;
  };
  searchParams: {};
}
const Page = ( { params: { customer_id } }: PageProps ) => {
  return (
    <main>
      <NewSurveyForm className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>
              Create your new Survey
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3">
            <input
              type="hidden"
              id="id"
              name="id"
              value={ customer_id }
            />
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="name"
                placeholder="Survey name"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton
              className="ml-auto"
              icon={ <PlusIcon /> }
            >
              Create
            </SubmitButton>
          </CardFooter>
        </Card>
      </NewSurveyForm>
    </main>
  );
};

export default Page;