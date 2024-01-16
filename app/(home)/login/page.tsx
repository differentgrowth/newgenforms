import { EnterIcon } from "@radix-ui/react-icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInForm, SignUpForm } from "@/components/forms-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {};
  searchParams: {
    value?: string;
  }
}

const Page = async ( { searchParams: { value = 'login' } }: PageProps ) => {
  return (
    <main>
      <Tabs
        defaultValue={ value }
        className="mx-auto w-full max-w-lg"
      >
        <TabsList className="flex">
          <TabsTrigger
            value="login"
            className="grow"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="grow"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LogInForm>
            <Card>
              <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>
                  Your answers are waiting!
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-3 flex flex-col space-y-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="me@email.com"
                  />
                </div>
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
              </CardContent>
              <CardFooter>
                <SubmitButton
                  className="ml-auto"
                  icon={ <EnterIcon /> }
                >
                  Enter
                </SubmitButton>
              </CardFooter>
            </Card>
          </LogInForm>
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm>
            <Card>
              <CardHeader>
                <CardTitle>Create your account in seconds!</CardTitle>
                <CardDescription>
                  Welcome to the quickest and easiest way to get answers.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-3 flex flex-col space-y-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="me@email.com"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    placeholder="***"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="repeat_password">Repeat password</Label>
                  <Input
                    id="repeat_password"
                    name="repeat_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="***"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  <Switch
                    id="terms"
                    name="terms"
                  />
                  <Label htmlFor="terms">Terms of use</Label>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton
                  className="ml-auto"
                  icon={ <EnterIcon /> }
                >
                  Register
                </SubmitButton>
              </CardFooter>
            </Card>
          </SignUpForm>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Page;