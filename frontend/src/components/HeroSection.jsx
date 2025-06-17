import { Link} from 'react-scroll';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 text-center relative">
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-purple-600 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-blue-600 opacity-10 blur-3xl -z-10"></div>
      
      <div className="glass-effect max-w-4xl mx-auto p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-transparent rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 -z-10 animate-gradient-border"></div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          SPPU Practical Code Repository
        </h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          One-stop solution for all your university practical codes. Search, contribute, and collaborate with fellow students!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
         
        <Link
  to="how-it-works"
  smooth={true}
  duration={600}
  offset={-60} // optional: adjust if you have a fixed header
>
  <button className="glass-button px-6 py-3 font-medium">
    How It Works →
  </button>
</Link>


        </div>
      </div>
    </section>
  );
};

export default HeroSection;