import { ROLE_MATRIX } from "../permissions.js";

export const authorize = (permission, capability) => {
    return (req, res, next) => {
        const role = req.user?.role; // extracted from JWT by jwtMiddleware

        // Nested permissions (e.g. manage_incidents.create)
        if (permission && capability && ROLE_MATRIX?.[role]?.[permission]?.[capability]) {
            return next();
        }
        // Flat permissions (e.g. view_logs)
        else if (permission && !capability && ROLE_MATRIX?.[role]?.[permission]) {
            return next();
        }
        // Denied
        else {
            return res.status(403).json({
                message: "You are authenticated but not AUTHORIZED to do this operation"
            });
        }
    };
};
