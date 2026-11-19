import { Link, useNavigate } from 'react-router-dom';
import avatarHeaderImg from '../../assets/images/avatar-header.png';
import studyFlowLogoImg from '../../assets/images/studyflow-logo.png';
import { MaterialIcon } from '../common/MaterialIcon';

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
  linkProfile?: boolean;
}

export function TopHeader({
  title,
  showBack = false,
  linkProfile = true,
}: TopHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-space-sm px-space-md">
        <div className="flex min-w-0 items-center gap-space-sm">
          {showBack && (
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="-ml-2 flex h-12 w-12 shrink-0 items-center justify-center text-on-surface transition-colors hover:text-primary"
            >
              <MaterialIcon name="arrow_back_ios_new" />
            </button>
          )}
          <Link to="/dashboard" className="shrink-0">
            <img
              src={studyFlowLogoImg}
              alt="StudyFlow Logo"
              className="h-8 w-auto shrink-0 object-contain"
            />
          </Link>
          {showBack ? (
            <h1 className="truncate font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h1>
          ) : (
            <span className="truncate font-headline-sm text-headline-sm text-on-surface">
              {title}
            </span>
          )}
        </div>

        {linkProfile ? (
          <Link
            to="/profile"
            aria-label="Open profile"
            className="flex h-12 w-12 shrink-0 items-center justify-end"
          >
            <img
              src={avatarHeaderImg}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
        ) : (
          <img
            src={avatarHeaderImg}
            alt="Profile"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        )}
      </div>
    </header>
  );
}
