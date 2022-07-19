import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useState,
} from "react";
import ConfirmationDialog from "../Components/common/ConfirmationDialog";

const ConfirmContext = createContext({
  confirm: async (options) => null,
});

const DEFAULT_OPTIONS = {
  title: "Are you sure?",
  text: "",
  okText: "Ok",
  cancelText: "Cancel",
};

export const ConfirmProvider = ({ children }) => {
  const [options, setOptions] = useState({ ...DEFAULT_OPTIONS });

  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions({ ...DEFAULT_OPTIONS, ...options });
      setResolveReject([resolve, reject]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject();
      handleClose();
    }
  }, [reject, handleClose]);

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve();
      handleClose();
    }
  }, [resolve, handleClose]);

  return (
    <Fragment>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmationDialog
        open={resolveReject.length === 2}
        options={options}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Fragment>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
