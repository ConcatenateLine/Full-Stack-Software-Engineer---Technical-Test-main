import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router";

const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter((segment) => segment);
  return segments
    .filter((segment) => !/^\d+$/.test(segment))
    .map((segment, index) => ({
      title: segment.replace(/-/g, " ").toUpperCase(),
      url: `/${segments.slice(0, index + 1).filter((s) => !/^\d+$/.test(s)).join("/")}`,
    }));
};

const SiteHeader = () => {
  const navigate = useNavigate();
  const breadcrumbItems = generateBreadcrumbs(window.location.pathname);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.length > 1 &&
              breadcrumbItems.map((item, index) =>
                index < breadcrumbItems.length - 1 ? (
                  <>
                    <BreadcrumbItem key={`${item.title}-${index}`}>
                      <BreadcrumbLink
                        className="cursor-pointer"
                        onClick={() => navigate(item.url)}
                      >
                        {item.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ) : null
              )}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-base font-medium">
          {breadcrumbItems[breadcrumbItems.length - 1].title}
        </h1>
      </div>
    </header>
  );
};

export default SiteHeader;
