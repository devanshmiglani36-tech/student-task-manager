import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { Toast } from '../components/common/Toast';
import { useAppContext } from '../context/AppContext';

export function RegistrationPage() {
  const navigate = useNavigate();
  const { register, showToast } = useAppContext();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done'>(
    'idle',
  );

  const strengthScore = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      score++;
    }
    if (password.length >= 10 && /[^A-Za-z0-9]/.test(password)) {
      score++;
    }
    return score;
  }, [password]);

  const strengthInfo = useMemo(() => {
    if (strengthScore === 0) {
      return { text: 'Strength', colorClass: 'text-outline' };
    }
    if (strengthScore === 1) {
      return { text: 'Weak', colorClass: 'text-error' };
    }
    if (strengthScore === 2) {
      return { text: 'Good', colorClass: 'text-secondary' };
    }
    return { text: 'Strong', colorClass: 'text-tertiary' };
  }, [strengthScore]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !major || !password || !confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    if (password.length < 6) {
      setFeedback({
        type: 'error',
        message: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!termsAccepted) {
      setFeedback({
        type: 'error',
        message: 'Please accept the Terms of Service to continue.',
      });
      return;
    }

    setFeedback(null);
    setSubmitState('loading');

    try {
      const createdUser = await register({
        name: trimmedName,
        email: trimmedEmail,
        major,
        password,
      });
      setSubmitState('done');
      const firstName = createdUser.name.split(' ')[0];
      setFeedback({
        type: 'success',
        message: `Welcome to StudyFlow, ${firstName}! Your student workspace is ready.`,
      });
      showToast(`Welcome aboard, ${firstName}!`);
      window.setTimeout(() => {
        navigate('/dashboard');
      }, 450);
    } catch (err) {
      setSubmitState('idle');
      setFeedback({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Could not create account. Please try again.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface pt-safe pb-safe">
      <main className="relative flex min-h-screen w-full flex-col justify-center bg-surface px-space-md">
        <div className="flex w-full flex-col py-space-lg">
          <div className="relative mx-auto w-full max-w-md">
            <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-tr from-primary-container/25 via-secondary-container/20 to-tertiary/15 opacity-70 blur-2xl" />

            <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-lg shadow-xl">
              <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-gradient-to-bl from-primary-container/15 to-transparent" />

              <div className="mb-space-lg flex flex-col items-center text-center">
                <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-container to-primary-container text-on-primary-container shadow-md">
                  <MaterialIcon name="bolt" filled className="text-2xl" />
                </div>

                <div className="mb-space-xs flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
                    StudyFlow
                  </span>
                  <span className="rounded-full bg-primary-container/20 px-2 py-0.5 font-label-sm text-label-sm text-primary">
                    BETA
                  </span>
                </div>

                <h1 className="mb-space-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  Create your student account
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Lock in your semester. Organize deadlines, labs, and
                  late-night sprints.
                </p>
              </div>

              <form
                className="flex flex-col gap-space-md"
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-space-xs">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="full-name"
                  >
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="person"
                      className="pointer-events-none absolute left-3 text-lg text-outline"
                    />
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-space-md font-body-md text-body-md text-on-surface placeholder:text-outline/60 transition-colors focus:bg-surface-container-low focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="university-email"
                  >
                    University Email
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="school"
                      className="pointer-events-none absolute left-3 text-lg text-outline"
                    />
                    <input
                      id="university-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arivera@stanford.edu"
                      className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-space-md font-body-md text-body-md text-on-surface placeholder:text-outline/60 transition-colors focus:bg-surface-container-low focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="major"
                  >
                    Major / Department
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="menu_book"
                      className="pointer-events-none absolute left-3 text-lg text-outline"
                    />
                    <select
                      id="major"
                      required
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-10 font-body-md text-body-md text-on-surface transition-colors focus:bg-surface-container-low focus:outline-none"
                    >
                      <option disabled value="">
                        Select your major
                      </option>
                      <option value="cs">Computer Science</option>
                      <option value="bio">Biology &amp; Life Sciences</option>
                      <option value="bus">Business &amp; Economics</option>
                      <option value="eng">Mechanical Engineering</option>
                      <option value="psych">Psychology</option>
                      <option value="design">Digital Media &amp; Design</option>
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute right-3 text-lg text-outline"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <label
                      className="font-label-md text-label-md text-on-surface-variant"
                      htmlFor="reg-password"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <MaterialIcon
                        name="lock"
                        className="pointer-events-none absolute left-3 text-lg text-outline"
                      />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline/60 transition-colors focus:bg-surface-container-low focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 flex items-center justify-center text-outline transition-colors hover:text-on-surface"
                      >
                        <MaterialIcon
                          name={showPassword ? 'visibility_off' : 'visibility'}
                          className="text-lg"
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-space-xs pt-1">
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strengthScore >= 1
                            ? 'bg-error'
                            : 'bg-surface-container-highest'
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strengthScore >= 2
                            ? 'bg-secondary'
                            : 'bg-surface-container-highest'
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strengthScore >= 3
                            ? 'bg-tertiary'
                            : 'bg-surface-container-highest'
                        }`}
                      />
                      <span
                        className={`ml-1 font-label-sm text-label-sm ${strengthInfo.colorClass}`}
                      >
                        {strengthInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <label
                      className="font-label-md text-label-md text-on-surface-variant"
                      htmlFor="confirm-password"
                    >
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <MaterialIcon
                        name="verified_user"
                        className="pointer-events-none absolute left-3 text-lg text-outline"
                      />
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline/60 transition-colors focus:bg-surface-container-low focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 flex items-center justify-center text-outline transition-colors hover:text-on-surface"
                      >
                        <MaterialIcon
                          name={
                            showConfirmPassword ? 'visibility_off' : 'visibility'
                          }
                          className="text-lg"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <label
                  className="flex cursor-pointer select-none items-start gap-space-sm pt-space-xs"
                  htmlFor="terms"
                >
                  <div className="relative mt-0.5 flex items-center justify-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded transition-colors ${
                        termsAccepted
                          ? 'bg-primary-container'
                          : 'bg-surface-container-lowest'
                      }`}
                    >
                      <MaterialIcon
                        name="check"
                        weight={700}
                        className={`text-xs text-on-primary-container transition-opacity ${
                          termsAccepted ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => showToast('Terms of Service reviewed')}
                      className="font-medium text-primary hover:underline"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => showToast('Privacy Policy reviewed')}
                      className="font-medium text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {feedback && (
                  <div
                    role="alert"
                    className={`rounded-lg px-space-md py-space-sm font-body-sm text-body-sm ${
                      feedback.type === 'error'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-tertiary-container text-on-tertiary-container'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="mt-space-xs flex w-full items-center justify-center gap-space-sm rounded-lg bg-gradient-to-r from-secondary-container via-inverse-primary to-primary-container px-space-md py-3 font-label-lg text-label-lg text-on-primary-container shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
                >
                  {submitState === 'loading' ? (
                    <>
                      <MaterialIcon
                        name="progress_activity"
                        className="animate-spin text-lg"
                      />
                      <span>Creating workspace...</span>
                    </>
                  ) : submitState === 'done' ? (
                    <>
                      <span>Account Created</span>
                      <MaterialIcon name="check_circle" className="text-lg" />
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <MaterialIcon name="arrow_forward" className="text-lg" />
                    </>
                  )}
                </button>
              </form>

              <div className="-mx-space-lg -mb-space-lg mt-space-lg bg-surface-container-low px-space-lg py-space-md text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Already have an account?
                  <Link
                    to="/login"
                    className="ml-1 font-label-lg text-label-lg text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
}
