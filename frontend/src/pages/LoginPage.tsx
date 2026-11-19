import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleLogoIcon,
  StudyFlowCubeIcon,
} from '../components/common/BrandMark';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { Toast } from '../components/common/Toast';
import { useAppContext } from '../context/AppContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, showToast } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your university email and password.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const signedInUser = await login({
        email: email.trim(),
        password,
        rememberMe,
      });
      showToast(`Welcome back, ${signedInUser.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to sign in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    showToast('Google OAuth requires configuring GOOGLE_CLIENT_ID on the backend');
  };

  const handleForgotPassword = () => {
    showToast('Contact your campus workspace admin or register a new account');
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface pt-safe pb-safe">
      <main className="relative flex min-h-screen w-full flex-col justify-center bg-surface px-space-md">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-space-lg">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-secondary-container/20 blur-3xl" />

          <div className="relative z-10 flex w-full max-w-md flex-col gap-space-lg rounded-xl bg-surface-container p-space-lg shadow-xl">
            <div className="flex flex-col items-center gap-space-sm text-center">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-container to-primary-container shadow-md">
                  <StudyFlowCubeIcon className="h-6 w-6 text-on-primary-container" />
                </div>
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
                  StudyFlow
                </span>
              </div>

              <div className="mt-space-xs flex flex-col gap-space-xs">
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  Welcome back, Scholar
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Lock in for tonight’s session. Your deadlines are waiting.
                </p>
              </div>
            </div>

            <form
              className="flex flex-col gap-space-md"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-space-xs">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="login-email"
                >
                  University Email
                </label>
                <div className="relative flex items-center">
                  <MaterialIcon
                    name="school"
                    className="pointer-events-none absolute left-space-md text-title-lg text-on-surface-variant"
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@stanford.edu"
                    className="w-full rounded-lg bg-surface-container-low py-3 pl-11 pr-space-md font-body-md text-body-md text-on-surface placeholder:text-outline transition-colors focus:bg-surface-container-high focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <MaterialIcon
                    name="lock"
                    className="pointer-events-none absolute left-space-md text-title-lg text-on-surface-variant"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-surface-container-low py-3 pl-11 pr-11 font-body-md text-body-md text-on-surface placeholder:text-outline transition-colors focus:bg-surface-container-high focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-space-sm flex items-center justify-center rounded-lg p-space-xs text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
                  >
                    <MaterialIcon
                      name={showPassword ? 'visibility_off' : 'visibility'}
                      className="text-title-lg"
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-space-xs">
                <label className="flex cursor-pointer select-none items-center gap-space-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded transition-colors ${
                      rememberMe
                        ? 'bg-primary-container'
                        : 'bg-surface-container-highest'
                    }`}
                  >
                    <MaterialIcon
                      name="check"
                      filled
                      className={`text-body-sm text-on-primary-container transition-opacity ${
                        rememberMe ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-label-md text-label-md text-primary transition-colors hover:text-primary-fixed"
                >
                  Forgot password?
                </button>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-space-xs flex w-full items-center justify-center gap-space-sm rounded-lg bg-gradient-to-r from-secondary-container to-primary-container px-space-md py-3 font-label-lg text-label-lg text-on-primary-container shadow-md transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-80"
              >
                <span>
                  {isSubmitting ? 'Entering workspace...' : 'Sign In'}
                </span>
                <MaterialIcon
                  name={isSubmitting ? 'bolt' : 'arrow_forward'}
                  className="text-title-md"
                />
              </button>
            </form>

            <div className="flex items-center gap-space-md">
              <div className="h-px flex-1 bg-surface-container-highest" />
              <span className="font-label-sm text-label-sm uppercase text-outline">
                or
              </span>
              <div className="h-px flex-1 bg-surface-container-highest" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-space-sm rounded-lg bg-surface-container-high px-space-md py-3 font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-container-highest"
            >
              <GoogleLogoIcon />
              <span>Continue with Google</span>
            </button>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              Don’t have an account?
              <Link
                to="/register"
                className="ml-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-fixed"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
}
