"use client";
import { useRouter } from "next/navigation";
const Homepage = () => {
  const router = useRouter();
  return (
    <section className="ms-8 w-full relative container p-10">
      <div className="head_text blue_gradient_w w-full">
        Discover jobs that match your profile!
      </div>
      <div>
        <p className="desc ms-5 w-1/2 text-justify">
          Navigate your career journey with precision. Our Job Recommendation
          Platform is your compass in the professional landscape. Discover roles
          that align with your skills and ambitions. Your ideal career path
          starts here!
        </p>
        <button
          onClick={() => {
            router.push("/Feed");
          }}
          className="btn mt-10 ms-5 w-1/4"
        >
          Find jobs now!
        </button>
      </div>
    </section>
  );
};
export default Homepage;
