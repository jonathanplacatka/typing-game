interface TableRowProps {
  index: number;
  WPM: number;
  username: string;
  score: number;
  place: number;
};

export default function TableRow({index, username, WPM, score, place} : TableRowProps ) {
	return (
		<tr>
			<td className='py-3 pl-4'>
				<span className=''>
					{index === 0 ? 1 : index + 1}
				</span>
			</td>
			<td className='px-2 md:px-0'>
				<div className='flex items-center gap-2'>
					{username}
				</div>
			</td>
			<td className='px-2 text-bg md:px-0'>
				<span className={('rounded-md bg-bg px-2 py-1 text-xs text-hl')}>
					{WPM}
				</span>
			</td>
			<td className='hidden px-2 text-sm text-bg sm:table-cell md:px-0'>
				{score}
			</td>
			<td className='hidden px-2 text-sm text-bg sm:table-cell md:px-0'>
				 {place !== -1 ? place : ''}
			</td>
		</tr>
	);
};
