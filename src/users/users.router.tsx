import { CreateUserPage } from "./pages/CreateUserPage";
import { UserPage } from "./pages/UserPage";

export const userRoutes = [
    {
        index: true,
        element: <UserPage />
    },
    {
        path: 'new',
        element: <CreateUserPage />
    },
    {
        path: ':id',
        element: <CreateUserPage />
    },
];