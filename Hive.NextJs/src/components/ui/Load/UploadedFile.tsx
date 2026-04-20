interface UploadedFileProps {
  title: string;
  fileType: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export default function UploadedFile({
  title = "Page Preview",
  checked = false,
  onChange,
  fileType
}: UploadedFileProps) {

  return (
    <div className="relative w-[110px] h-[120px] border border-gray-300 rounded-lg flex flex-col items-center justify-center">

      <label className="absolute top-2 left-2 cursor-pointer">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />

        <div
          className={`w-5 h-5 rounded flex items-center justify-center ${checked ? "bg-primary text-white" : "bg-gray-300"
            }`}
        >
          {checked && <span className="text-xl font-bold">✓</span>}
        </div>
      </label>

      <span className="text-sm text-gray-700 px-1 truncate block w-full" title={title}>{title}</span>
      <span className="text-xs text-gray-500 pt-2">{fileType}</span>
    </div>
  );
}