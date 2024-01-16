import { notFound } from "next/navigation";

import { AccountForm, UpdatePasswordForm } from "@/components/forms-account";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getCustomerById } from "@/lib/db";

import { PickerLanguage, PickerTimezone } from "@/components/pickers";
import { SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {
    customer_id: string;
  };
  searchParams: {}
}

const Page = async ( { params: { customer_id } }: PageProps ) => {
  const customer = await getCustomerById( customer_id );

  if ( !customer ) {
    notFound();
  }

  return (
    <main>
      <AccountForm className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col space-y-3">
            <input
              type="hidden"
              id="id"
              name="id"
              value={ customer_id }
            />
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="me@email.com"
                defaultValue={ customer.email }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">Language</p>
              <PickerLanguage defaultValue={ customer.language } />
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">Default timezone</p>
              <PickerTimezone defaultValue={ customer.timezone } />
            </div>
            <div className="flex items-center space-x-1.5">
              <Switch
                id="commercial_communications"
                name="commercial_communications"
                defaultChecked={ customer.commercial_communications }
              />
              <Label htmlFor="commercial_communications">Commercial Communications</Label>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton className="ml-auto">
              Update
            </SubmitButton>
          </CardFooter>
        </Card>
      </AccountForm>

      <Separator className="mx-auto my-12 w-2/3 max-w-3xl" />

      <UpdatePasswordForm className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>
              Password
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3 flex flex-col space-y-3">
            <input
              type="hidden"
              id="id"
              name="id"
              value={ customer_id }
            />
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="***"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="new_password">New password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                autoComplete="new_password"
                placeholder="***"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="repeat_new_password">Repeat new password</Label>
              <Input
                id="repeat_new_password"
                name="repeat_new_password"
                type="password"
                autoComplete="new_password"
                placeholder="***"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton className="ml-auto">
              Update
            </SubmitButton>
          </CardFooter>
        </Card>
      </UpdatePasswordForm>
    </main>
  );
};

export default Page;