import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { placeholderReporters } from "@/lib/placeholder-data";
import { PlusCircle, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const QrCodeSvg = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H30V30H0V0ZM10 10H20V20H10V10Z"
        fill="currentColor"
      />
      <path d="M40 0H50V10H40V0Z" fill="currentColor" />
      <path d="M60 0H70V10H60V0Z" fill="currentColor" />
      <path d="M40 20H50V30H40V20Z" fill="currentColor" />
      <path d="M90 20H100V30H90V20Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M70 0H100V30H70V0ZM80 10H90V20H80V10Z"
        fill="currentColor"
      />
      <path d="M0 40H10V50H0V40Z" fill="currentColor" />
      <path d="M20 40H30V50H20V40Z" fill="currentColor" />
      <path d="M40 40H50V50H40V40Z" fill="currentColor" />
      <path d="M60 40H70V50H60V40Z" fill="currentColor" />
      <path d="M80 40H90V50H80V40Z" fill="currentColor" />
      <path d="M0 60H10V70H0V60Z" fill="currentColor" />
      <path d="M40 60H50V70H40V60Z" fill="currentColor" />
      <path d="M70 60H80V70H70V60Z" fill="currentColor" />
      <path d="M90 60H100V70H90V60Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 70H30V100H0V70ZM10 80H20V90H10V80Z"
        fill="currentColor"
      />
      <path d="M40 80H50V90H40V80Z" fill="currentColor" />
      <path d="M60 80H80V90H60V80Z" fill="currentColor" />
      <path d="M90 80H100V90H90V80Z" fill="currentColor" />
    </svg>
  );

export default function PressCardsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Press Cards</h2>
            <p className="text-muted-foreground">
                Issue and manage digital press cards for your reporters.
            </p>
        </div>
        <div className="ml-auto">
            <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Issue New Card
            </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {placeholderReporters.map((reporter) => {
            const reporterImage = PlaceHolderImages.find((img) => img.id === reporter.imageId);
            return (
                <Card key={reporter.id} className="shadow-md bg-card overflow-hidden">
                    <div className="p-6 bg-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-primary font-headline">
                            <Image src="/logo.png" alt="JD News" width={90} height={30} className="h-7 w-auto" />
                        </div>
                        <div className="text-xs font-semibold uppercase text-primary">Press</div>
                    </div>
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
                                {reporterImage && <AvatarImage src={reporterImage.imageUrl} alt={reporter.name}/>}
                                <AvatarFallback>{reporter.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold">{reporter.name}</h3>
                            <p className="text-primary font-medium">{reporter.title}</p>
                            <p className="text-sm text-muted-foreground mt-2">ID: {reporter.id.toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">Issued: {reporter.joinedDate}</p>
                        </div>
                    </CardContent>
                    <div className="p-6 bg-muted/50 flex items-center justify-between">
                        <QrCodeSvg />
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
