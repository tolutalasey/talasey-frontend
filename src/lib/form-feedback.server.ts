import 'server-only';
import { cookies } from 'next/headers';
import { env } from './env';
import { FEEDBACK_COOKIE } from './feedback-cookie';
import {
  hasFeedback,
  parseFeedback,
  serialiseFeedback,
  type FeedbackForm,
  type FormFeedback,
  type FormState,
} from './form-feedback';

// Hands a form's result back to the page as well as to the form, so it shows without JavaScript.
export async function settle(form: FeedbackForm, state: FormState): Promise<FormState> {
  const store = await cookies();
  if (!hasFeedback(state)) {
    store.delete(FEEDBACK_COOKIE);
    return state;
  }
  store.set(FEEDBACK_COOKIE, serialiseFeedback(form, state), {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.APP_ENV !== 'development',
    path: '/',
    maxAge: 60,
  });
  return state;
}

export async function readFeedback(): Promise<FormFeedback> {
  return parseFeedback((await cookies()).get(FEEDBACK_COOKIE)?.value);
}
