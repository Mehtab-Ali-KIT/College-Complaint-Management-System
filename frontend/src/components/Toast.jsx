import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
    if (!toast) return null;

    const { type, message } = toast;

    const getIcon = () => {
        if (type === "success") return <CheckCircle className="text-success" size={20} />;
        if (type === "error") return <AlertCircle className="text-danger" size={20} />;
        return <Info className="text-info" size={20} />;
    };

    return (
        <div className="toast-container-custom">
            <div className="toast-item border">
                {getIcon()}
                <span className="flex-grow-1">{message}</span>
                <button
                    onClick={onClose}
                    className="btn btn-sm text-muted p-0 border-0 ms-2"
                    style={{ background: "transparent" }}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
