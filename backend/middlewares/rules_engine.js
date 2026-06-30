import { ROLE_MATRIX } from "../permissions.js";

export const authorize = (permission, capability) => {
    return (req, res, next) => {
        const role = String(req.user?.role || '').toLowerCase(); // extracted from JWT by jwtMiddleware

        // Flat permissions (e.g. view_logs)
        if (permission && !capability && ROLE_MATRIX?.[role]?.[permission]) {
            return next();
        }
        
        // Nested permissions (e.g. manage_incidents.create)
        else if (permission && capability && ROLE_MATRIX?.[role]?.[permission]?.[capability]) {
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
