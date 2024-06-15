import { Suspense } from "react";

const SuspenseWrapper = ({ children }) => {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default SuspenseWrapper;
