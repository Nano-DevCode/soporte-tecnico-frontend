import { UserCreatePage } from "./pages/UserCreatePage";
import { UserDetailsPage } from "./pages/UserDetailsPage";
import { UserEditPage } from "./pages/UserEditPage";
import { UserPage } from "./pages/UserPage";

export const userRoutes = [
    {
        index: true,
        element: <UserPage />
    },
    {
        path: 'new',
        element: <UserCreatePage />
    },
    {
        path: 'details/:id',
        element: <UserDetailsPage />
    },
    {
        path: 'edit/:id',
        element: <UserEditPage/>
    }
];