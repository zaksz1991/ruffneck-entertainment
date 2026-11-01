import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, short_description, category, is_free, level")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  const freeCourse = courses?.find((c) => c.is_free) || courses?.[0];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Learn AI & digital skills that work in Nigeria</h1>
          <p>
            Practical courses from RuffNeck Entertainment — for founders, freelancers,
            and professionals who want usable skills, not theory only.
          </p>
          <div className="hero-actions">
            <Link href="/courses" className="btn btn-primary">
              Browse courses
            </Link>
            <Link href="/signup" className="btn btn-ghost">
              Create free account
            </Link>
          </div>
          <div className="hero-pills" aria-label="Highlights">
            <span className="free">Free course available</span>
            <span className="cert">Free certificate on completion</span>
            <span>Learn on any device</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="offer-band">
            <div>
              <h2>Start free — finish with a certificate</h2>
              <p>
                Enroll in our free course at no cost. Complete the lessons and earn a
                certificate of completion — also free. No payment required to start.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link
                href={freeCourse ? `/courses/${freeCourse.slug}` : "/courses"}
                className="btn btn-primary"
              >
                {freeCourse ? "Open free course" : "View courses"}
              </Link>
              <Link href="/signup" className="btn btn-outline">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Featured courses</h2>
          {!courses?.length ? (
            <p className="muted">No published courses yet.</p>
          ) : (
            <div className="grid">
              {courses.map((c) => (
                <article key={c.id} className="card">
                  <div className="thumb">📘</div>
                  <div className="card-body">
                    <div>
                      {c.is_free ? (
                        <>
                          <span className="badge badge-free">Free</span>
                          <span className="badge badge-cert">Certificate</span>
                        </>
                      ) : (
                        <span className="badge">{c.level}</span>
                      )}
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.short_description}</p>
                    <Link href={`/courses/${c.slug}`} className="btn btn-navy">
                      View course
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
