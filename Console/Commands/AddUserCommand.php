<?php

namespace Laravex\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class AddUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:add-user {--email=} {--passwd=} {--name=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add a new user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        if (!$email) {
            $email = $this->ask("What's the email?");
        }
        $passwd = $this->option('passwd');
        if (!$passwd) {
            $passwd = $this->secret("What's the password?");
        }
        $name = $this->option('name') ?? $email;
        $user = User::create(['email' => $email, 'password' => Hash::make($passwd), 'name' => $name]);
        $this->info("user created: " . $user);
    }
}
