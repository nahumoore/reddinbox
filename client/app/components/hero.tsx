export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Coming Soon
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
          Your Reddit CRM
          <br />
          <span className="text-primary">Redefined</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Manage Reddit DMs, discover leads, and build relationships with the most powerful 
          CRM platform designed specifically for Reddit marketing.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
            Join the Waitlist
          </button>
          <button className="w-full sm:w-auto border border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors">
            Learn More
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative">
            <div className="flex items-center mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-sm text-muted-foreground">Reddinbox Dashboard Preview</span>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-primary/20 rounded"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}