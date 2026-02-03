import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit2,
  Trash2,
} from "lucide-react";
import { IUser } from "./IUser";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import getStatusTranslation, { UserStatus } from "./UserStatus";
import { useTranslation } from "react-i18next";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
dayjs.extend(utc);
dayjs.extend(timezone);
interface UserCardProps {
  user: IUser;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function UserCard({
  user,
  isExpanded,
  onToggle,
  onDelete,
  onEdit,
}: UserCardProps) {
  const { t } = useTranslation();
  return (
    <div
      className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm transition-all duration-200 my-2"
      key={user.username}
    >
      <div
        className="flex items-center gap-4 p-4 justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => onToggle(user.id)}
      >
        <div className="flex items-center gap-4">
          <img
            src={user.avatar ?? defaultAvatarPicker.getAvatar(user.gender)}
            alt={user.firstName + user.lastName}
            className="rounded-full h-12 w-12 border-2 border-primary/10 object-cover"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <p className="text-[#0d141b] text-base font-semibold leading-none">
                {user.firstName} {user.lastName}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-300`}
              >
                {t(getStatusTranslation(user.status as UserStatus) as any)}
              </span>
              {false && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-primary">
                  Admin
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm font-normal mt-1 text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-text-muted p-2 hover:bg-slate-100 rounded-full transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-[#fcfdfe] border-t border-border-light p-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <div className="flex flex-col gap-1">
              <p className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">
                Email
              </p>
              <div className="flex items-center gap-2 text-[#0d141b] text-sm font-medium">
                <Mail size={14} className="text-text-muted" />
                {user.email}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">
                Phone
              </p>
              <div className="flex items-center gap-2 text-[#0d141b] text-sm font-medium">
                <Phone size={14} className="text-text-muted" />
                {user.phoneNumber}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">
                Date of birth
              </p>
              <div className="flex items-center gap-2 text-[#0d141b] text-sm font-medium">
                <Calendar size={14} className="text-text-muted" />
                {user.dateOfBirth
                  ? dayjs
                      .utc(user.dateOfBirth)
                      .tz(dayjs.tz.guess())
                      .format("DD/MM/YYYY")
                  : "_"}
              </div>
            </div>
            <div className="flex flex-col gap-1 relative">
              <p className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">
                Joined At
              </p>
              <div className="flex items-center gap-2 text-[#0d141b] text-sm font-medium">
                <Clock size={14} className="text-text-muted" />
                {dayjs
                  .utc(user.createdAt)
                  .tz(dayjs.tz.guess())
                  .format("DD/MM/YYYY")}
              </div>

              <div className="flex items-center gap-2 mt-4 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0">
                <button
                  className="text-text-muted p-2 bg-slate-100 hover:bg-gray-300 rounded-lg transition-colors border border-transparent hover:border-border-light flex items-center gap-1.5 cursor-pointer px-4"
                  title="Edit"
                  onClick={() => onEdit()}
                >
                  <Edit2 size={16} />
                  <span className="text-xs font-semibold uppercase sm:hidden">
                    Edit
                  </span>
                </button>
                <button
                  className="text-text-muted bg-red-100 p-2 hover:bg-red-300 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-1.5 cursor-pointer px-4"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
                  }}
                >
                  <Trash2 size={16} />
                  <span className="text-xs font-semibold uppercase sm:hidden">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
