const HomeContainer = () => {
  return (
    <>
      <div className="container relative h-[800px] flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0 mt-9 rounded-lg overflow-hidden">
        <div className="relative hidden h-full flex-col bg-muted p-1 dark:border-r lg:flex p-9">
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Management Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 margin-9">
              <p className="text-lg text-left">
                &ldquo;Management Inc is a leading provider of user management
                solutions, helping businesses streamline their user management
                processes and improve overall efficiency.&rdquo;
              </p>
              <footer className="text-sm">...</footer>
            </blockquote>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="w-full h-full mx-auto flex flex-col justify-center space-y-6 bg-[url(https://st2.depositphotos.com/2343945/42321/v/450/depositphotos_423211004-stock-illustration-light-bulb-business-plan-infographic.jpg)]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                User Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your users here
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContainer;
