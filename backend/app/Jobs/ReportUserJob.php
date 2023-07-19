<?php


namespace App\Jobs;


use App\Admin;
use App\Library\Mail;
use App\User;
use Maatwebsite\Excel\Facades\Excel;

class ReportUserJob extends Job
{
    private $userId;
    private $baseUrl;

    /**
     * ReportUserJob constructor.
     * @param $user
     * @param $baseUrl
     */
    public function __construct($userId, $baseUrl)
    {
        //
        $this->userId = $userId;
        $this->baseUrl = $baseUrl;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $admin = Admin::find($this->userId);
        $url = urldecode($this->baseUrl);

        $users = new User;

        if($admin->role > 1)
            $users = $users->where('province_id', $admin->province_id);

        if($admin->role > 2)
            $users = $users->where('province_id', $admin->city_id);

        $header = [
            'No. Member' => 'member_number',
            'NIK',
            'NAMA',
            'GENDER',
            'EMAIL',
            'NO.TLP',
            'PROVINSI',
            'KOTA',
            'INDUK OLAHRAGA',
            'STATUS ORGANISASI',
        ];

        $users = $users->with(['province', 'city', 'organitationStatus', 'organitationParent'])->get();

        $path = 'storage/export/users/' . $admin->id;
        $excelName = $admin->id . "_user_" . date('Ymdhis');
        Excel::create($excelName, function ($excel) use ($users, $header) {
            $excel->sheet('Sheet1', function ($sheet) use ($users, $header) {
                $row = 1;
                $sheet->row($row, $header);

                foreach ($users as $user) {
                    $row++;

                    $sheet->row($row, [
                        $user->nik,
                        $user->name,
                        $user->gender == 'l' ? "WANITA" : "PRIA",
                        $user->email,
                        $user->phone_number,
                        $user->province->name ?? '',
                        $user->city->name ?? '',
                        $user->organitationParent->parent_name ?? '',
                        $user->organitationStatus->title ?? '',
                    ]);
                }
            });

        })->store('xls', base_path('public/' . $path));

        $url = "$url/$path/$excelName.xls";

        $sendMail = \App\Library\Mail::to($admin->email)
            ->template('email.report_user', ['link' => $url, 'admin' => $admin])
            ->subject('Report User')
            ->Send();

    }
}