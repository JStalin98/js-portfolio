import Image from "next/image";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";

interface ArchitectureGalleryProps {
  images: string[];
  context: string;
}

export function ArchitectureGallery({ images, context }: ArchitectureGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-[22px] font-medium tracking-[-0.5px] text-bone mb-8">
        Architecture
      </h2>

      <MotionSection className="flex flex-col gap-6">
        {images.map((src, i) => (
          <MotionItem key={i}>
            <div className="w-full rounded-[12px] overflow-hidden border border-[rgba(139,146,165,0.2)] bg-carbon">
              <Image
                src={src}
                alt={`Architecture diagram ${i + 1} of ${images.length} — ${context}`}
                width={1600}
                height={900}
                className="w-full h-auto object-contain"
                unoptimized
              />
            </div>
          </MotionItem>
        ))}
      </MotionSection>
    </div>
  );
}
