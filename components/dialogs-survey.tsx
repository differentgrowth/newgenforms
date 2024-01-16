import { FilePlusIcon, LapTimerIcon, TrashIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeleteSurveyForm, MarkSurveyAsPublicForm, MarkSurveyAsReadyForm } from "@/components/forms-survey";
import { SURVEY_STATUS } from "@/definitions/survey";

export const MarkAsReadyDialog = ( { surveyId }: {
  surveyId: string;
} ) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="grow sm:col-start-2"
        >
          Ready
          <LapTimerIcon className="ml-1.5 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark survey as ready</DialogTitle>
          <DialogDescription>
            The survey will no longer be editable.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-1.5">
          <MarkSurveyAsReadyForm surveyId={ surveyId } />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const MarkAsPublicDialog = ( { surveyId, status }: {
  surveyId: string;
  status: SURVEY_STATUS;
} ) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="grow sm:col-start-3"
        >
          Publish
          <FilePlusIcon className="ml-1.5 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark survey as ready</DialogTitle>
          <DialogDescription>
            Take the public survey now and start collecting responses
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-1.5">
          <MarkSurveyAsPublicForm
            surveyId={ surveyId }
            status={ status }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export const DeleteDialog = ( { surveyId, name }: {
  surveyId: string;
  name: string;
} ) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="col-span-2 grow sm:col-span-1 sm:col-start-5"
        >
          Delete
          <TrashIcon className="ml-1.5 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete survey</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your survey from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-1.5">
          <DeleteSurveyForm
            surveyId={ surveyId }
            name={ name }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};