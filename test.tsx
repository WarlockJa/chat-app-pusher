import { usePathname } from "next/navigation";
// import credentialsData from "../public/credentials.json";

export default function Home() {
  const pathname = usePathname();
  const credentialsDataAPI = fetch(`${pathname}/api`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Data from public/credentials.json read in page</h1>
        <p>{`${credentialsData.surname} ${credentialsData.name}`}</p>
        <p>{credentialsData.email}</p>
        <p>
          password:{" "}
          <span className="opacity-10 hover:opacity-100 transition ease-in-out delay-150">
            {credentialsData.password}
          </span>
        </p>
      </div>
      <div>
        <h1>Data from public/credentials.json using api request</h1>
        <p>{`${credentialsDataAPI.surname} ${credentialsDataAPI.name}`}</p>
        <p>{credentialsDataAPI.email}</p>
        <p>
          password:{" "}
          <span className="opacity-10 hover:opacity-100 transition ease-in-out delay-150">
            {credentialsDataAPI.password}
          </span>
        </p>
      </div>
    </main>
  );
}
