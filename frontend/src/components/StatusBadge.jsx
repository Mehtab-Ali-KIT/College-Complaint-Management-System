import { Clock, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, HelpCircle } from "lucide-react";

export function StatusBadge({ status }) {
    switch (status) {
        case "Pending":
            return (
                <span className="badge-status badge-status-pending">
                    <Clock size={13} />
                    Pending
                </span>
            );
        case "Assigned":
            return (
                <span className="badge-status badge-status-assigned">
                    <UserCheck size={13} />
                    Assigned
                </span>
            );
        case "In Progress":
            return (
                <span className="badge-status badge-status-in-progress">
                    <AlertTriangle size={13} />
                    In Progress
                </span>
            );
        case "Resolved":
            return (
                <span className="badge-status badge-status-resolved">
                    <CheckCircle2 size={13} />
                    Resolved
                </span>
            );
        case "Closed":
            return (
                <span className="badge-status badge-status-closed">
                    <ShieldCheck size={13} />
                    Closed
                </span>
            );
        default:
            return (
                <span className="badge-status badge-status-closed">
                    <HelpCircle size={13} />
                    {status || "Unknown"}
                </span>
            );
    }
}

export function PriorityBadge({ priority }) {
    const prio = priority || "Medium";
    if (prio === "High") {
        return <span className="badge-status badge-priority-high">High Priority</span>;
    }
    if (prio === "Low") {
        return <span className="badge-status badge-priority-low">Low Priority</span>;
    }
    return <span className="badge-status badge-priority-medium">Medium Priority</span>;
}
