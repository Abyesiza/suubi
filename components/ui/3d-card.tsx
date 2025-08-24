"use client";

import { cn } from "@/lib/utils";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

interface CardContainerProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotationFactor?: number; // Control sensitivity of 3D rotation
  perspective?: number; // Control 3D perspective depth
  enableRotation?: boolean; // Toggle 3D rotation on/off
}

export const CardContainer = ({
  children,
  className,
  containerClassName,
  rotationFactor = 25,
  perspective = 1000,
  enableRotation = true,
}: CardContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !enableRotation) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / rotationFactor;
    const y = (e.clientY - top - height / 2) / rotationFactor;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-6 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: `${perspective}px`,
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'wide' | 'tall' | 'square' | 'auto' | 'full';
  background?: 'white' | 'glass' | 'gradient' | 'dark';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
}

export const CardBody = ({
  children,
  className,
  variant = 'default',
  background = 'white',
  shadow = 'lg',
  border = true,
  rounded = 'xl',
  minHeight,
  maxHeight,
  width,
  maxWidth,
}: CardBodyProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'min-h-[16rem] w-80';
      case 'wide':
        return 'min-h-[16rem] w-96';
      case 'tall':
        return 'min-h-[32rem] w-80';
      case 'square':
        return 'h-80 w-80';
      case 'auto':
        return 'w-full h-auto';
      case 'full':
        return 'w-full h-full';
      default:
        return 'min-h-[24rem] w-96';
    }
  };

  const getBackgroundClasses = () => {
    switch (background) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border-white/20';
      case 'gradient':
        return 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800';
      case 'dark':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-white dark:bg-gray-900 dark:text-white';
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case 'none':
        return '';
      case 'sm':
        return 'shadow-sm';
      case 'md':
        return 'shadow-md';
      case 'lg':
        return 'shadow-lg';
      case 'xl':
        return 'shadow-xl';
      default:
        return 'shadow-lg';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case '2xl':
        return 'rounded-2xl';
      case '3xl':
        return 'rounded-3xl';
      default:
        return 'rounded-xl';
    }
  };

  const customSizeStyles = {
    ...(minHeight && { minHeight }),
    ...(maxHeight && { maxHeight }),
    ...(width && { width }),
    ...(maxWidth && { maxWidth }),
  };

  return (
    <div
      className={cn(
        "[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] transition-all duration-300",
        getVariantClasses(),
        getBackgroundClasses(),
        getShadowClasses(),
        getRoundedClasses(),
        border && 'border border-gray-200 dark:border-gray-700',
        'overflow-hidden relative',
        className
      )}
      style={customSizeStyles}
    >
      {children}
    </div>
  );
};

interface CardItemProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  scale?: number;
  duration?: number;
  delay?: number;
  [key: string]: any;
}

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  duration = 200,
  delay = 0,
  ...rest
}: CardItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAnimations();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isMouseEntered, delay]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit ease-linear", className)}
      style={{
        transitionDuration: `${duration}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Convenience components for common card layouts
export const Card3D = ({
  children,
  title,
  description,
  image,
  variant = 'default',
  background = 'white',
  className,
  containerClassName,
  minHeight,
  maxHeight,
  width,
  maxWidth,
  ...props
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  variant?: 'default' | 'compact' | 'wide' | 'tall' | 'square' | 'auto' | 'full';
  background?: 'white' | 'glass' | 'gradient' | 'dark';
  className?: string;
  containerClassName?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
  [key: string]: any;
}) => {
  return (
    <CardContainer containerClassName={containerClassName} {...props}>
      <CardBody 
        variant={variant} 
        background={background} 
        className={className}
        minHeight={minHeight}
        maxHeight={maxHeight}
        width={width}
        maxWidth={maxWidth}
      >
        {image && (
          <CardItem translateZ="50" className="w-full mb-4">
            <img
              src={image}
              className="h-48 w-full object-cover rounded-t-xl"
              alt={title || "Card image"}
            />
          </CardItem>
        )}
        
        <div className="p-6">
          {title && (
            <CardItem translateZ="50" className="mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
            </CardItem>
          )}
          
          {description && (
            <CardItem translateZ="60" className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {description}
              </p>
            </CardItem>
          )}
          
          {children && (
            <CardItem translateZ="70">
              {children}
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
