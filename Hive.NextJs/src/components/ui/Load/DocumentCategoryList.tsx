import { Document } from "@/components/modal/UploadDocumentModal";
import { SelectOption } from "../Select"

export interface Props {
  categories: SelectOption[];
  uploadedFiles: Document[];
}

const BackendUrl = process.env.NEXT_PUBLIC_DOCUMENTS_URL;

export default function DocumentCategoryList({ categories, uploadedFiles }: Props) {
  return <div>
    <div className="flex flex-col gap-2">
      {categories?.map((category, index) => (
        <div key={index} className="flex gap-1">
          <div className="w-[90px] flex justify-end">
            <div className="underline mr-1.5">
              {category.label}
            </div>
            <span className="text-primary">
              -
            </span>
          </div>
          {(() => {
            const filesInCategory = uploadedFiles?.filter(
              (file) => file.categoryName === category.label
            );

            const count = filesInCategory?.length;

            return (
              <>
                <span>{count}</span>{""}
                <div className='flex flex-wrap'>
                  {filesInCategory?.map((file, index) => {
                    const parts = file.fileName?.split(".");
                    const ext = parts?.pop()?.toUpperCase() ?? "UNKNOWN";

                    return (
                      <a
                        href={`${BackendUrl}/${file.categoryName}/${file.fileName}`}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-sm mt-1 text-primary flex-wrap'
                      >
                        <span>[{ext}]</span>
                      </a>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      ))}
    </div>
  </div>
}