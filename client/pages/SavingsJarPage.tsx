import SavingsJar from "@/components/SavingsJar.new";
import { savings as initial } from "@/data/sampleData";

export default function SavingsJarPage(){
  return (
    <div className="space-y-6">
      <SavingsJar initial={{ name: initial.name, target: initial.target, current: initial.current, deadline: initial.deadline }} />
    </div>
  );
}
