import StoreFooter from "@/components/StoreFooter";

export default function About() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-6">
          About Aurum
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-display font-medium text-foreground mb-3">
              Our Story
            </h2>
            <p>
              Founded in 2020, Aurum was born from a passion for timeless luxury
              and modern craftsmanship. We believe that true luxury lies in the
              details — the weight of a perfectly balanced timepiece, the
              suppleness of hand-stitched leather, the clarity of
              precision-ground lenses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-medium text-foreground mb-3">
              Our Mission
            </h2>
            <p>
              We curate an exclusive collection of premium accessories for the
              discerning individual. Each piece in our collection is selected for
              its exceptional quality, distinctive design, and enduring appeal.
              We partner with the world&apos;s finest artisans and manufacturers
              to bring you accessories that transcend trends.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="glass-card rounded-lg p-6 text-center">
              <p className="text-3xl font-display font-bold text-primary mb-2">
                5,000+
              </p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <p className="text-3xl font-display font-bold text-primary mb-2">
                200+
              </p>
              <p className="text-sm text-muted-foreground">Curated Products</p>
            </div>
            <div className="glass-card rounded-lg p-6 text-center">
              <p className="text-3xl font-display font-bold text-primary mb-2">
                30+
              </p>
              <p className="text-sm text-muted-foreground">Countries Served</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-display font-medium text-foreground mb-3">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Quality First",
                  desc: "Every product undergoes rigorous quality checks before joining our collection.",
                },
                {
                  title: "Sustainable Luxury",
                  desc: "We partner with brands committed to ethical sourcing and sustainable practices.",
                },
                {
                  title: "Personal Service",
                  desc: "Our concierge team provides personalized styling advice and white-glove support.",
                },
                {
                  title: "Authenticity Guaranteed",
                  desc: "Every item comes with a certificate of authenticity and a lifetime warranty.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="p-4 rounded-lg bg-secondary/30"
                >
                  <h3 className="text-foreground font-medium mb-1">{v.title}</h3>
                  <p className="text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <StoreFooter />
    </>
  );
}
