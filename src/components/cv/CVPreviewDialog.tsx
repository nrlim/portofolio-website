"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileDown } from "lucide-react"
import { CVTemplate } from "./CVTemplate"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export function CVPreviewDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const cvRef = useRef<HTMLDivElement>(null)

    const handleDownload = async () => {
        if (!cvRef.current) return

        try {
            setIsDownloading(true)

            // 0. PREPARE SMART PAGINATION
            // Create a clone to manipulate DOM without affecting the user's view
            const original = cvRef.current
            const clone = original.cloneNode(true) as HTMLElement

            // We need to append it to body to get strict metrics
            clone.style.position = 'absolute'
            clone.style.top = '-9999px'
            clone.style.left = '0'
            clone.style.width = `${original.offsetWidth}px` // Maintain width
            document.body.appendChild(clone)

            // Calculate Page Height in Pixels (based on 282mm content height)
            const pxPerMM = clone.offsetWidth / 210
            const footerHeightMM = 15
            const contentHeightMM = 297 - footerHeightMM
            const pageHeightPx = contentHeightMM * pxPerMM

            // Find all "atomic" items that shouldn't be broken
            const items = Array.from(clone.querySelectorAll('.cv-item')) as HTMLElement[]

            // Iterate and push down if needed
            for (const item of items) {
                const rect = item.getBoundingClientRect()
                const cloneRect = clone.getBoundingClientRect()

                // Position relative to the top of the CV
                const relativeTop = rect.top - cloneRect.top
                const relativeBottom = rect.bottom - cloneRect.top

                // Check if this item crosses a page boundary
                const pageIndexStart = Math.floor(relativeTop / pageHeightPx)
                const pageIndexEnd = Math.floor(relativeBottom / pageHeightPx)

                const pageBoundary = (pageIndexStart + 1) * pageHeightPx
                const spaceBelow = pageBoundary - relativeBottom

                // LOGIC:
                // 1. If it visually crosses the line (Start != End) -> MUST ACTION
                // 2. OR if it fits but sits too close to bottom (< 60px) and isn't a paragraph -> PUSH to prevent widowed headers
                let mustAction = (pageIndexStart !== pageIndexEnd)
                if (spaceBelow < 60 && item.tagName !== 'P') {
                    mustAction = true
                }

                if (mustAction) {
                    // Logic for Paragraph Splitting (Text Splitting)
                    // ONLY split if it ACTUALLY crosses the line.
                    // If we just decided to push it because of spaceBelow, we shouldn't split it, just push it.
                    if (item.tagName === 'P' && pageIndexStart !== pageIndexEnd) {
                        const pageBoundaryActual = pageIndexEnd * pageHeightPx
                        const spaceLeft = pageBoundaryActual - relativeTop - 15

                        // If tiny space, just push
                        if (spaceLeft < 50) {
                            const pushDownAmount = pageBoundaryActual - relativeTop + 24
                            const currentMargin = parseInt(window.getComputedStyle(item).marginTop) || 0
                            item.style.marginTop = `${currentMargin + pushDownAmount}px`
                            continue
                        }

                        // BINARY SEARCH SPLIT
                        const text = item.textContent || ''
                        const words = text.split(' ')
                        let low = 0, high = words.length
                        let splitIndex = 0

                        item.innerText = ''

                        while (low <= high) {
                            const mid = Math.floor((low + high) / 2)
                            const testText = words.slice(0, mid).join(' ')
                            item.innerText = testText
                            if (item.getBoundingClientRect().height <= spaceLeft) {
                                splitIndex = mid
                                low = mid + 1
                            } else {
                                high = mid - 1
                            }
                        }

                        const firstPart = words.slice(0, splitIndex).join(' ')
                        const secondPart = words.slice(splitIndex).join(' ')

                        if (firstPart && secondPart) {
                            item.innerText = firstPart
                            const nextItem = item.cloneNode(true) as HTMLElement
                            nextItem.innerText = secondPart

                            const newHeight = item.getBoundingClientRect().height
                            const gap = pageBoundaryActual - (relativeTop + newHeight)
                            const nextStartMargin = 24
                            nextItem.style.marginTop = `${gap + nextStartMargin}px`
                            item.parentNode?.insertBefore(nextItem, item.nextSibling)
                        } else {
                            item.innerText = text
                            const pushDownAmount = pageBoundaryActual - relativeTop + 24
                            const currentMargin = parseInt(window.getComputedStyle(item).marginTop) || 0
                            item.style.marginTop = `${currentMargin + pushDownAmount}px`
                        }

                    } else {
                        // Push Whole Block (Header or small P)
                        // Target the NEXT page. 
                        // If pageIndexStart == pageIndexEnd, target is pageIndexStart + 1
                        // If pageIndexStart != pageIndexEnd, target is pageIndexEnd (which is Start + 1 usually)

                        const targetPage = (pageIndexStart !== pageIndexEnd) ? pageIndexEnd : (pageIndexStart + 1)
                        const targetTop = targetPage * pageHeightPx

                        const pushDownAmount = targetTop - relativeTop + 24
                        const currentMargin = parseInt(window.getComputedStyle(item).marginTop) || 0
                        item.style.marginTop = `${currentMargin + pushDownAmount}px`
                    }
                }
            }

            // 1. Capture Canvas (from Clone)
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
                imageTimeout: 0,
                onclone: (clonedDoc) => {
                    Array.from(clonedDoc.getElementsByTagName('link')).forEach(link => {
                        if (link.rel === 'stylesheet') link.remove();
                    });
                    Array.from(clonedDoc.getElementsByTagName('style')).forEach(style => {
                        style.remove();
                    });
                }
            })

            // EXTRACT LINKS BEFORE DESTROYING CLONE
            // We must use the clone's layout for links because items were moved
            const domRoot = clone.getBoundingClientRect()
            const linkElements = clone.querySelectorAll('a')
            const mmPerDomPx = 210 / domRoot.width // Width is fixed 210mm

            interface LinkData {
                relX: number;
                relY: number;
                relW: number;
                relH: number;
                href: string;
            }

            const linkData: LinkData[] = []
            linkElements.forEach(link => {
                const rect = link.getBoundingClientRect()
                linkData.push({
                    relX: rect.left - domRoot.left,
                    relY: rect.top - domRoot.top,
                    relW: rect.width,
                    relH: rect.height,
                    href: link.href
                })
            })

            // Cleanup clone
            document.body.removeChild(clone)

            const imgData = canvas.toDataURL('image/png')

            // 2. Initialize PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()   // 210
            const pdfHeight = pdf.internal.pageSize.getHeight() // 297

            // Re-define constants for Clarity
            const footerHeight = 15
            const contentHeightPerPage = pdfHeight - footerHeight

            const canvasWidth = canvas.width
            const canvasHeight = canvas.height

            // Ratio calculation
            const contentWidthInMM = pdfWidth
            const scaleFactor = contentWidthInMM / canvasWidth
            const totalContentHeightInMM = canvasHeight * scaleFactor

            const totalPages = Math.ceil(totalContentHeightInMM / contentHeightPerPage)

            // 3. Render Pages
            let srcY = 0
            for (let page = 1; page <= totalPages; page++) {
                if (page > 1) pdf.addPage()

                pdf.addImage(imgData, 'PNG', 0, -srcY, contentWidthInMM, totalContentHeightInMM)

                // MASK FOOTER
                pdf.setFillColor(255, 255, 255)
                pdf.rect(0, contentHeightPerPage, pdfWidth, footerHeight, 'F')

                // Footer Content
                pdf.setFontSize(9)
                pdf.setTextColor(150, 150, 150)

                // Left: Website
                pdf.text('nuralim.dev', 15, pdfHeight - 10)
                pdf.link(15, pdfHeight - 13, 20, 5, { url: 'https://nuralim.dev' })

                // Right: Page Number
                pdf.text(`Page ${page} of ${totalPages}`, pdfWidth - 15, pdfHeight - 10, { align: 'right' })

                srcY += contentHeightPerPage
            }

            // 4. Inject Links (Using Data from Clone)
            linkData.forEach(l => {
                const linkX = l.relX * mmPerDomPx
                const linkY = l.relY * mmPerDomPx
                const linkW = l.relW * mmPerDomPx
                const linkH = l.relH * mmPerDomPx

                const linkPage = Math.floor(linkY / contentHeightPerPage) + 1
                const linkYOnPage = linkY - ((linkPage - 1) * contentHeightPerPage)

                if (linkPage <= totalPages && linkYOnPage < contentHeightPerPage) {
                    pdf.setPage(linkPage)
                    pdf.link(linkX, linkYOnPage, linkW, linkH, { url: l.href })
                }
            })

            pdf.save('Nuralim_CV.pdf')

        } catch (error) {
            console.error("Error generating PDF:", error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hidden md:flex" suppressHydrationWarning>
                    <FileDown className="h-4 w-4" />
                    Download CV
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[90vw] md:max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-gray-50/95 backdrop-blur-sm">

                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur flex justify-between items-center z-10 shrink-0">
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900">Curriculum Vitae Preview</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">Review layout and download as PDF</DialogDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleDownload} disabled={isDownloading} className="min-w-[140px]">
                            {isDownloading ? (
                                <>
                                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gray-100/50">
                    <div className="relative shadow-2xl origin-top transition-transform duration-200">
                        {/* 
                We render the CV Template here. 
                We might scale it down with CSS transform to fit comfortably on smaller screens if needed,
                but keeping it natural size and scrolling is often clearer for review.
                However, to fit "page view", a slight zoom out is nice.
             */}
                        <div className="transform scale-[0.6] md:scale-[0.8] origin-top-center md:origin-top">
                            <CVTemplate ref={cvRef} />
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
