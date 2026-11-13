'use client';

import type { AccessAnswers } from '@/api-client';
import { Button } from '@/ui/Button/Button';
import { Form } from '@/ui/Form/Form';
import { Radio, RadioGroup } from '@/ui/RadioGroup/RadioGroup';
import { useActionState } from 'react';
import { answerAccess } from '../actions';
import type { FormState } from '../forms';
import { FormMessage } from './FormMessage';

const yesNo = (value: boolean | undefined) =>
  value === undefined ? undefined : value ? 'yes' : 'no';

interface Props {
  answers: AccessAnswers | null;
  initialState?: FormState;
}

export function AccessForm({ answers, initialState = {} }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(answerAccess, initialState);

  return (
    <Form action={action} validationErrors={state.fieldErrors}>
      <RadioGroup
        label="What is the largest vehicle that can reach you?"
        name="vehicleAccess"
        defaultValue={answers?.vehicleAccess}
        isRequired
      >
        <Radio value="articulated" description="16.5 m long, needs a wide road and space to turn">
          Articulated lorry
        </Radio>
        <Radio value="rigid" description="7.5 tonne, about 10 m long">
          Rigid lorry
        </Radio>
        <Radio value="small" description="Narrow lanes, low bridges or weight limits">
          Small van only
        </Radio>
      </RadioGroup>
      <RadioGroup
        label="Is there hard standing where the pallet can be put down?"
        description="A firm, level surface such as a drive or pavement"
        name="hardStanding"
        defaultValue={yesNo(answers?.hardStanding)}
        isRequired
      >
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>
      <RadioGroup
        label="Is a kerbside drop OK?"
        description="The driver leaves the pallet at the kerb and cannot carry it further"
        name="kerbsideOk"
        defaultValue={yesNo(answers?.kerbsideOk)}
        isRequired
      >
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>
      <FormMessage message={state.message} />
      <div>
        <Button type="submit" isPending={pending}>
          Save delivery access
        </Button>
      </div>
    </Form>
  );
}
