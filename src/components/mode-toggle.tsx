"use client";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const themes = [
	{
		key: "system",
		icon: Monitor,
		label: "System theme",
	},
	{
		key: "light",
		icon: Sun,
		label: "Light theme",
	},
	{
		key: "dark",
		icon: Moon,
		label: "Dark theme",
	},
];

export type ThemeSwitcherProps = {
	value?: "light" | "dark" | "system";
	onChangeAction?: (theme: "light" | "dark" | "system") => void;
	defaultValue?: "light" | "dark" | "system";
	className?: string;
};

export const ThemeSwitcher = ({
	value,
	onChangeAction,
	defaultValue = "system",
	className,
}: ThemeSwitcherProps) => {
	const { theme: currentTheme, setTheme } = useTheme();
	const [theme, setThemeState] = useControllableState({
		defaultProp: defaultValue,
		prop: value,
		onChange: onChangeAction || setTheme,
	});
	const [mounted, setMounted] = useState(false);

	const handleThemeClick = useCallback(
		(themeKey: "light" | "dark" | "system") => {
			setThemeState(themeKey);
			setTheme(themeKey);
		},
		[setThemeState, setTheme]
	);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Sync with next-themes
	useEffect(() => {
		if (mounted && currentTheme) {
			setThemeState(currentTheme as "light" | "dark" | "system");
		}
	}, [mounted, currentTheme, setThemeState]);

	if (!mounted) {
		return null;
	}

	return (
		<div
			className={cn(
				"relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
				className
			)}
		>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = (theme || currentTheme) === key;
				return (
					<button
						aria-label={label}
						className="relative h-6 w-6 rounded-full"
						key={key}
						onClick={() =>
							handleThemeClick(key as "light" | "dark" | "system")
						}
						type="button"
					>
						{isActive && (
							<motion.div
								className="absolute inset-0 rounded-full bg-secondary"
								layoutId="activeTheme"
								transition={{ type: "spring", duration: 0.5 }}
							/>
						)}
						<Icon
							className={cn(
								"relative z-10 m-auto h-4 w-4",
								isActive
									? "text-foreground"
									: "text-muted-foreground"
							)}
						/>
					</button>
				);
			})}
		</div>
	);
};

// Export pour compatibilité avec l'ancien nom
export function ModeToggle() {
	return <ThemeSwitcher />;
}
