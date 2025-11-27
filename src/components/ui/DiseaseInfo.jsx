import { X } from "lucide-react";

export default function DiseaseInfoModal({ open, onClose, disease }) {
  if (!open) return null;

  const info = {
    Anthracnose: {
      description:
        "Anthracnose is a fungal disease that causes dark lesions on leaves, reducing photosynthesis.",
      causes: [
        "Fungal pathogen Colletotrichum spp.",
        "High humidity and wet environments",
        "Infected plant debris",
      ],
      treatments: [
        "Remove and destroy infected leaves",
        "Improve airflow around plants",
        "Use copper-based fungicides",
      ],
    },

    "Leaf Spot": {
      description:
        "Leaf Spot causes brown or black circular lesions that gradually spread across the leaf.",
      causes: [
        "Fungal pathogens (Cercospora, Phyllosticta)",
        "Overhead irrigation",
        "Warm, moist conditions",
      ],
      treatments: [
        "Prune affected areas",
        "Avoid watering leaves directly",
        "Apply recommended fungicides",
      ],
    },

    "Oidium Heveae": {
      description:
        "Oidium is a powdery mildew disease characterized by white fungal growth on leaf surfaces.",
      causes: [
        "Powdery mildew fungus",
        "Dry days followed by humid nights",
        "Poor sunlight exposure",
      ],
      treatments: [
        "Expose plants to sunlight",
        "Use sulfur-based fungicides",
        "Remove heavily infected leaves",
      ],
    },
  };

  const data = info[disease];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] max-w-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl text-[#5D4E37]">{disease}</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-6 h-6 text-[#5D4E37]" />
          </button>
        </div>

        <p className="text-[#5D4E37] mb-4">{data.description}</p>

        <h3 className="font-semibold text-[#C2794D] mb-2">Causes</h3>
        <ul className="list-disc ml-5 text-[#5D4E37] mb-4">
          {data.causes.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        <h3 className="font-semibold text-[#8FAA52] mb-2">Treatments</h3>
        <ul className="list-disc ml-5 text-[#5D4E37]">
          {data.treatments.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
