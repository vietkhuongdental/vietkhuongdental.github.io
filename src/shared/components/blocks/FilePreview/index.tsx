/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import * as Dialog from '@radix-ui/react-dialog';
import { isEmpty } from 'lodash-es';
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

type Props = {
  allowDownload?: boolean;
  fileType?: string;
  isVisible: boolean;
  onClose: () => void;
  onDownload?: () => void;
  url: string;
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export const FilePreview: React.FC<Props> = ({
  url,
  isVisible,
  fileType = 'application/pdf',
  onClose,
  onDownload,
  allowDownload = true
}) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotate, setRotate] = useState(0);

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    '/src/pdf.worker.js',
    import.meta.url
  ).toString();

  useEffect(() => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleClosePDF = () => {
    onClose();
  };

  const zoomIn = () => {
    setScale((current) => current + 0.2);
  };

  const zoomOut = () => {
    setScale((current) => current - 0.2);
  };

  const rotateLeft = () => {
    setRotate((current) => current - 90);
  };

  const rotateRight = () => {
    setRotate((current) => current + 90);
  };

  const handlePDFPrev = () => {
    if (pageNumber > 1) {
      setPageNumber((current) => current - 1);
    } else {
      setPageNumber(numPages);
    }
  };

  const handlePDFNext = () => {
    if (pageNumber < numPages) {
      setPageNumber((current) => current + 1);
    } else {
      setPageNumber(1);
    }
  };

  const disabledEventPropagation = (event: Event | React.SyntheticEvent) => {
    event.stopPropagation();
  };

  // useKeyPress('Escape', () => {
  //   handleClosePDF();
  // });

  const pdfHeight = window.innerHeight - 50;

  return (
    <Dialog.Root
      onOpenChange={(open) => !open && handleClosePDF()}
      open={isVisible}
    >
      <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" />
      <Dialog.Content className="fixed inset-0 z-[1500] flex h-screen w-screen flex-col items-center justify-center rounded-2xl bg-background-default">
        {isEmpty(url) ? (
          <Spinner />
        ) : fileType === 'application/pdf' ? (
          <Document
            onLoadError={(error) => {
              console.error('❌ Error loading PDF:', error);
            }}
            options={{
              cMapUrl: 'cmaps/',
              cMapPacked: true
            }}
            file={url}
            loading={<Spinner />}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <div
              className="fixed left-0 top-0 flex h-[50px] w-full justify-center bg-background-solid px-8 text-text-inverse"
              onClick={disabledEventPropagation}
            >
              <div className="flex flex-row items-center justify-center">
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  isDisabled={numPages <= 1}
                  leadingIcon={<ChevronLeft />}
                  onClick={handlePDFPrev}
                  variant="outline"
                />
                <span className="font-lg flex items-center whitespace-nowrap px-2 py-0">{`${pageNumber} of ${numPages}`}</span>
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  isDisabled={numPages <= 1}
                  leadingIcon={<ChevronRight />}
                  onClick={handlePDFNext}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<ZoomIn />}
                  onClick={zoomIn}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<ZoomOut />}
                  onClick={zoomOut}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<RotateCcw />}
                  onClick={rotateLeft}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<RotateCw />}
                  onClick={rotateRight}
                  variant="outline"
                />
                {allowDownload ? (
                  <Button
                    className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                    leadingIcon={<DownloadIcon />}
                    onClick={onDownload}
                    variant="outline"
                  />
                ) : null}
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<X />}
                  onClick={handleClosePDF}
                  variant="outline"
                />
              </div>
            </div>
            <div className="mt-[50px] h-[calc(100vh-50px)] w-full overflow-y-auto">
              <Page
                className="[&>canvas]:mx-auto [&>canvas]:w-auto"
                height={pdfHeight}
                loading={<Spinner />}
                onClick={disabledEventPropagation}
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                rotate={rotate}
                scale={scale}
              />
            </div>
          </Document>
        ) : (
          <div>
            <div
              className="fixed left-0 top-0 flex h-[50px] w-full justify-center bg-background-solid px-8 text-text-inverse"
              onClick={disabledEventPropagation}
            >
              <div className="flex flex-row items-center justify-center">
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  isDisabled={numPages <= 1}
                  leadingIcon={<ChevronLeft />}
                  onClick={handlePDFPrev}
                  variant="outline"
                />
                <span className="font-lg flex items-center whitespace-nowrap px-2 py-0">{`${pageNumber} of ${numPages}`}</span>
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  isDisabled={numPages <= 1}
                  leadingIcon={<ChevronRight />}
                  onClick={handlePDFNext}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<ZoomIn />}
                  onClick={zoomIn}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<ZoomOut />}
                  onClick={zoomOut}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<RotateCcw />}
                  onClick={rotateLeft}
                  variant="outline"
                />
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<RotateCw />}
                  onClick={rotateRight}
                  variant="outline"
                />
                {allowDownload ? (
                  <Button
                    className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                    leadingIcon={<DownloadIcon />}
                    onClick={onDownload}
                    variant="outline"
                  />
                ) : null}
                <Button
                  className="ml-[10px] text-lg text-text-inverse focus:shadow-lg"
                  leadingIcon={<X />}
                  onClick={handleClosePDF}
                  variant="outline"
                />
              </div>
            </div>
            <div className="mt-[50px] flex h-[calc(100vh-50px)] w-full items-center justify-center overflow-y-auto bg-background-default">
              <img
                alt="Preview"
                className="max-h-full max-w-full rounded-lg object-contain"
                src={url}
              />
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
