import LoginForm from "./components/LoginForm";

const AuthContainer = () => {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthContainer;
