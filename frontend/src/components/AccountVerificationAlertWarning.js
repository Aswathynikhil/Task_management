import { useDispatch, useSelector } from "react-redux";
import { ExclamationIcon } from "@heroicons/react/solid";
import { accountVerificationSendTokenAction } from "../features/auth/authSlice";

export default function AccountVerificationAlertWarning() {
  const dispatch = useDispatch();
  return (
    <div className="acc">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="exc"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-200">
            Your account is not verified.{" "}
            <button
              onClick={() => dispatch(accountVerificationSendTokenAction())}
              className="font-medium underline text-green-200 hover:text-yellow-600"
            >
              Click this link to verify
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
